<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Login;
use App\Entity\Opinion;
use App\Entity\Product;
use App\Repository\UserRepository;
use App\Repository\LoginRepository;
use App\Service\TokenAuthenticator;
use App\Repository\OpinionRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\RefreshTokenRepository;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AdminController extends AbstractController
{
    private EntityManagerInterface $em;
    private $tokenAuthenticator;
    private $loginRepository;
    private $opinionRepository;

    public function __construct(
        EntityManagerInterface $em,
        TokenAuthenticator $tokenAuthenticator,
        LoginRepository $loginRepository,
        OpinionRepository $opinionRepository
    ) {
        $this->em = $em;
        $this->tokenAuthenticator = $tokenAuthenticator;
        $this->loginRepository = $loginRepository;
        $this->opinionRepository = $opinionRepository;
    }

    #[Route('/admin/users/count', name: 'admin_users_count', methods: ['GET'])]
    public function getUserCount(Request $request): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $userCount = $this->em->getRepository(User::class)->count([]);
        return new JsonResponse(['count' => $userCount]);
    }

    #[Route('/admin/products/count', name: 'admin_products_count', methods: ['GET'])]
    public function getProductCount(Request $request): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $productCount = $this->em->getRepository(Product::class)->count([]);
        return new JsonResponse(['count' => $productCount]);
    }


    #[Route('/admin/opinions/monthly', name: 'admin_opinions_monthly', methods: ['GET'])]
    public function getMonthlyOpinions(Request $request): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $opinions = $this->opinionRepository->getOpinionsByMonthAndYear();

        return new JsonResponse($opinions);
    }

    #[Route('/admin/logins/monthly', name: 'admin_logins_monthly', methods: ['GET'])]
    public function getMonthlyLogins(Request $request): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_ADMIN", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $logins = $this->loginRepository->getLoginCountByMonthAndYear();
        
        return new JsonResponse($logins);
    }
}
