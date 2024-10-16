<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\Friend;

class FriendController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/friend/{userId}', name: 'app_friend')]
    public function addFriend($userId): JsonResponse
    {
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }
    
        $currentUser = $this->getUser();
        if (!$currentUser instanceof User) {
            return new JsonResponse(['error' => 'Invalid user'], 401);
        } else {
            if ($currentUser->getId() === $user->getId()) {
                return new JsonResponse(['error' => 'You cannot add yourself as a friend'], 400);
            }
        }
    
        // Verificar si ya existe una relación de amistad en cualquier dirección
        $friendship = $this->entityManager->getRepository(Friend::class)->findOneBy([
            'user' => $currentUser,
            'friend' => $user
        ]) ?? $this->entityManager->getRepository(Friend::class)->findOneBy([
            'user' => $user,
            'friend' => $currentUser
        ]);
    
        if ($friendship) {
            if ($friendship->isConfirmed()) {
                return new JsonResponse(['error' => 'You are already friends'], 400);
            }
    
            // Si ya existe la solicitud, actualiza el estado a confirmado
            $friendship->setIsConfirmed(true);
            $friendship->setConfirmedAt(new \DateTime());
            $this->entityManager->flush();
    
            return new JsonResponse(['message' => 'Friendship confirmed']);
        }
    
        // Si no existe una relación de amistad, crear una nueva solicitud
        $friendRequest = new Friend();
        $friendRequest->setUser($currentUser);
        $friendRequest->setFriend($user);
        $friendRequest->setIsConfirmed(false); // Pendiente de confirmación
        $this->entityManager->persist($friendRequest);
        $this->entityManager->flush();
    
        return new JsonResponse(['message' => 'Friend request sent']);
    }
    
}
