<?php

namespace App\Security;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Authenticator\AbstractLoginFormAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Util\TargetPathTrait;

class LoginFormAuthenticator extends AbstractLoginFormAuthenticator
{
    public const LOGIN_ROUTE = 'app_login';

    private $urlGenerator;
    private $jwtManager;

    public function __construct(UrlGeneratorInterface $urlGenerator, JWTTokenManagerInterface $jwtManager)
    {
        $this->urlGenerator = $urlGenerator;
        $this->jwtManager = $jwtManager;
    }

    public function authenticate(Request $request): Passport
    {
        $requestData = json_decode($request->getContent(), true);

        $email = $requestData['email'] ?? null;
        $password = $requestData['password'] ?? null;


        return new Passport(
            new UserBadge($email),  // Zwraca użytkownika na podstawie emaila
            new PasswordCredentials($password),  // Sprawdza hasło
            [
                new RememberMeBadge(),  // Opcjonalnie dodaje obsługę Remember Me
            ]
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        // Przykład: Zwróć JSON z tokenem JWT
        $jwtToken = $this->jwtManager->create($token->getUser());  // Wygeneruj token JWT na podstawie użytkownika

        // Zwraca token jako część odpowiedzi JSON
        return new JsonResponse([
            'message' => 'Login successful!!!',  // Komunikat sukcesu
            'token' => $jwtToken,  // Wygenerowany token JWT
            'user' => [
                'email' => $token->getUser()->getUserIdentifier(),  // Identyfikator użytkownika (email)
            ],
        ], 200);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        // Zwraca odpowiedź w przypadku nieudanego logowania
        return new JsonResponse(['error' => $exception->getMessage()], 401);
    }

    protected function getLoginUrl(Request $request): string
    {
        return $this->urlGenerator->generate(self::LOGIN_ROUTE);  // Ścieżka do logowania
    }
}
