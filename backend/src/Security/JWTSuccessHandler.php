<?php
namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class JWTSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $user = $token->getUser();

        // Crea el token
        $jwt = $this->jwtManager->create($user);

        // Aquí puedes agregar más información al payload del token
        $payload = [
            'token' => $jwt,
            'iat' => time(),
            'exp' => time() + 3600, // 1 hora de expiración
            'roles' => $user->getRoles(),
            'email' => 'calabaza', // Agrega el email del usuario
            // Agrega aquí más información que desees
        ];

        return new JsonResponse($payload, Response::HTTP_OK);
    }
}
