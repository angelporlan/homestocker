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
                'nombre' => $house->getName()
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
}
