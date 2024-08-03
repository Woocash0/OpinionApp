<?php

namespace App\Controller;

use App\Repository\UserOpinionReactionRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\TokenAuthenticator;

class UserReactionController extends AbstractController
{
    private $userOpinionReactionRepository;
    private $tokenAuthenticator;

    public function __construct(UserOpinionReactionRepository $userOpinionReactionRepository, TokenAuthenticator $tokenAuthenticator)
    {
        $this->userOpinionReactionRepository = $userOpinionReactionRepository;
        $this->tokenAuthenticator = $tokenAuthenticator;
    }

    #[Route('/user-reactions/{productId}', name: 'user_reactions', methods: ['GET'])]
    public function getUserReactions(Request $request, int $productId): JsonResponse
    {
        error_log("Otrzymane Id Produtu:".print_r($productId,true));
        if (!$productId) {
            return new JsonResponse(['error' => 'Product ID is required'], 400);
        }
        $user = $this->tokenAuthenticator->authenticateToken($request);

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        // Pobierz reakcje użytkownika dla danego produktu
        $reactions = $this->userOpinionReactionRepository->findReactionsByProductIdAndUser($productId, $user->getId());

        $response = [];
        foreach ($reactions as $reaction) {
            $response[] = [
                'opinionId' => $reaction->getOpinion()->getId(),
                'reaction' => $reaction->getReaction()
            ];
        }

        return new JsonResponse(['reactions' => $response]);
    }
}
