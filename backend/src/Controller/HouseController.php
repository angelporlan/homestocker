<?php

namespace App\Controller;

use App\Entity\House;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class HouseController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/houses', name: 'house_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar que se proporcionen todos los campos necesarios
        if (!isset($data['name'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear la nueva casa
        $house = new House();
        $house->setName($data['name']);

        // Obtener el usuario autenticado
        $user = $this->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Invalid user'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Añadir al usuario autenticado como miembro de la casa
        $house->addUser($user);

        // Guardar la casa en la base de datos
        $this->entityManager->persist($house);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $house->getId(),
            'name' => $house->getName(),
            'members' => array_map(fn($user) => $user->getUsername(), $house->getUsers()->toArray()), // Retornar nombres de usuario de los miembros
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/houses/{id}', name: 'house_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $house = $this->entityManager->getRepository(House::class)->find($id);

        if (!$house) {
            return new JsonResponse(['error' => 'House not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id' => $house->getId(),
            'name' => $house->getName(),
            'members' => array_map(fn($user) => $user->getUsername(), $house->getUsers()->toArray()), // Retornar nombres de usuario de los miembros
        ]);
    }

    #[Route('/houses/{id}/addMember', name: 'house_add_member', methods: ['POST'])]
    public function addMember(Request $request, int $id): JsonResponse
    {
        $house = $this->entityManager->getRepository(House::class)->find($id);

        if (!$house) {
            return new JsonResponse(['error' => 'House not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Validar que se proporcione el ID del usuario
        if (!isset($data['user_id'])) {
            return new JsonResponse(['error' => 'Missing user_id'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Añadir el miembro a la casa
        $house->addUser($user);

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $house->getId(),
            'name' => $house->getName(),
            'members' => array_map(fn($user) => $user->getUsername(), $house->getUsers()->toArray()), // Retornar nombres de usuario de los miembros
        ]);
    }

    //delete member from house
    #[Route('/houses/{id}/deleteMember', name: 'house_delete_member', methods: ['POST'])]
    public function deleteMember(Request $request, int $id): JsonResponse
    {
        $house = $this->entityManager->getRepository(House::class)->find($id);

        if (!$house) {
            return new JsonResponse(['error' => 'House not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        // Validar que se proporcione el ID del usuario
        if (!isset($data['user_id'])) {
            return new JsonResponse(['error' => 'Missing user_id'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Remove the member from the house
        $house->removeUser($user);

        // Save changes to the database
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $house->getId(),
            'name' => $house->getName(),
            'members' => array_map(fn($user) => $user->getUsername(), $house->getUsers()->toArray()), // Return usernames of members
        ]);
    }
}