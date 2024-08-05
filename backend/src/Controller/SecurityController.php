<?php

namespace App\Controller;

use Ramsey\Uuid\Uuid;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\TokenAuthenticator;

class SecurityController extends AbstractController
{
    private UserRepository $userRepository;
    private JWTTokenManagerInterface $jwtManager;
    private RefreshTokenRepository $refreshTokenRepository;
    private EntityManagerInterface $em;
    private $tokenAuthenticator;

    public function __construct(
        UserRepository $userRepository,
        JWTTokenManagerInterface $jwtManager,
        RefreshTokenRepository $refreshTokenRepository,
        EntityManagerInterface $em,
        TokenAuthenticator $tokenAuthenticator
    ) {
        $this->userRepository = $userRepository;
        $this->jwtManager = $jwtManager;
        $this->refreshTokenRepository = $refreshTokenRepository;
        $this->em = $em;
        $this->tokenAuthenticator = $tokenAuthenticator;
    }

    #[Route(path: '/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $requestData = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Invalid JSON format'], 400);
        }

        $email = $requestData['email'] ?? null;
        $password = $requestData['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Missing email or password'], 400);
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid password'], 401);
        }

        try {
            $jwtToken = $this->jwtManager->create($user);
            $expiresAt = new \DateTime('+1 month');
            $refreshToken = $this->generateRefreshToken();

            $refreshTokenEntity = new RefreshToken();
            $refreshTokenEntity->setExpiresAt($expiresAt);
            $refreshTokenEntity->setToken($refreshToken);
            $refreshTokenEntity->setAssociatedUser($user);
            $this->em->persist($refreshTokenEntity);
            $this->em->flush();

            // Send the refresh token in the response body, not in a cookie
            return new JsonResponse([
                'message' => 'Login successful',
                'token' => $jwtToken,
                'refreshToken' => $refreshToken,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getUserIdentifier(),
                    'role' => $user->getRoles(),
                    'name' => $user->getIdUserDetails() ? $user->getIdUserDetails()->getName() : '',
                    'surname' => $user->getIdUserDetails() ? $user->getIdUserDetails()->getSurname() : '',
                ],
            ], 200);
        } catch (\Exception $e) {
            error_log("Error generating token: " . $e->getMessage());
            return new JsonResponse(['error' => 'Error generating token'], 500);
        }
    }

    #[Route(path: '/refresh', name: 'app_refresh', methods: ['POST'])]
    public function refresh(Request $request): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);
        $refreshToken = $data['refreshToken'] ?? null;

        if (!$refreshToken) {
            return new JsonResponse(['error' => 'Missing refresh token'], 400);
        }

        $refreshTokenEntity = $this->refreshTokenRepository->findOneBy(['token' => $refreshToken]);

        if (!$refreshTokenEntity || $refreshTokenEntity->getExpiresAt() < new \DateTime()) {
            return new JsonResponse(['error' => 'Invalid or expired refresh token'], 401);
        }

        $user = $refreshTokenEntity->getAssociatedUser();

        try {
            $newToken = $this->jwtManager->create($user);
            $expiresAt = new \DateTime('+1 month');

            $refreshTokenEntity->setExpiresAt($expiresAt);
            $this->em->persist($refreshTokenEntity);
            $this->em->flush();
            $newRefreshToken = $refreshTokenEntity->getToken();

            return new JsonResponse([
                'token' => $newToken,
                'newRefreshToken' => $newRefreshToken,
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            error_log("Error refreshing token: " . $e->getMessage());
            return new JsonResponse(['error' => 'Error refreshing token'], 500);
        }
    }

    private function generateRefreshToken(): string
    {
        return Uuid::uuid4()->toString();
    }

    #[Route('/account', name: 'account')]
    public function showAccount(Request $request): JsonResponse{
        try {
            $user = $this->tokenAuthenticator->authenticateToken($request);
            $userDetails = $user->getIdUserDetails();
    
            return new JsonResponse([
                'message' => "success", 
                'user' => [
                    'id' => $user->getId(),
                    'roles' => $user->getRoles(),
                    'email' => $user->getEmail(),
                    'name' => $userDetails->getName(),
                    'surname' => $userDetails->getSurname(),
                ],
            ]);
        } catch (BadCredentialsException $e) {
            return new JsonResponse(['message' => 'Inwalid JWT Token.'], Response::HTTP_UNAUTHORIZED);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(['message' => 'Session expired or user doesnt exist. Log in again.'], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route(path: '/logout', name: 'app_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return new JsonResponse(['message' => 'Logout successful']);
    }
}
