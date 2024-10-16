<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use App\Entity\Friend;

class UserController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Email already exists'], 409);
        }

        // Crear el nuevo usuario
        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // comprueba si el usuario tiene roles
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        } else {
            $user->setRoles(['ROLE_USER']);
        }
        $user->setImage($data['image']);
        // Guardar el usuario en la base de datos
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'image' => $user->getImage(),
            'roles' => $user->getRoles()
        ]);
    }

    #[Route('/users/profile', name: 'user_profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            throw new AuthenticationException('Invalid user');
        }

        // Obtener las casas asociadas al usuario
        $houses = $user->getHouses()->map(function ($house) {
            return [
                'id' => $house->getId(),
                'name' => $house->getName()
            ];
        })->toArray();

        return new JsonResponse([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'image' => $user->getImage(),
            'houses' => $houses
        ]);
    }

    #[Route('/users/friends', name: 'user_friends', methods: ['GET'])]
    public function friends(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user instanceof User) {
            throw new AuthenticationException('Invalid user');
        }
    
        // Obtener las solicitudes donde el usuario es el solicitante o el destinatario
        $friendsRepository = $this->entityManager->getRepository(Friend::class);
        
        $sentRequests = $friendsRepository->findBy(['user' => $user]);
        $receivedRequests = $friendsRepository->findBy(['friend' => $user]);
    
        $friends = array_merge($sentRequests, $receivedRequests);
    
        // Mapear todas las relaciones de amistad (enviadas y recibidas)
        $friendsList = array_map(function (Friend $friend) use ($user) {
            // Determinar cuál es el "amigo" (el otro usuario en la relación de amistad)
            $friendUser = $friend->getUser() === $user ? $friend->getFriend() : $friend->getUser();
    
            return [
                'id' => $friendUser->getId(),
                'username' => $friendUser->getUsername(),
                'email' => $friendUser->getEmail(),
                'image' => $friendUser->getImage(),
                'isConfirmed' => $friend->isConfirmed(), // Estado de la amistad
                'createdAt' => $friend->getUser()->getId(),
            ];
        }, $friends);
    
        return new JsonResponse($friendsList);
    }
    
}
