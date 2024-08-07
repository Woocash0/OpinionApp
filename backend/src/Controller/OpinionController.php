<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Opinion;
use App\Entity\UserOpinionReaction;
use App\Entity\Product;
use Sentiment\Analyzer;
use App\Repository\OpinionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Service\WarrantyNotificationService;
use App\Service\TokenAuthenticator;

class OpinionController extends AbstractController
{
    private $tokenAuthenticator;
    private $opinionRepository;
    private $em;
    private $warrantyNotificationService;

    public function __construct(TokenAuthenticator $tokenAuthenticator, OpinionRepository $opinionRepository, EntityManagerInterface $em, WarrantyNotificationService $warrantyNotificationService)
    {
        $this->tokenAuthenticator = $tokenAuthenticator;
        $this->opinionRepository = $opinionRepository;
        $this->em = $em;
        $this->warrantyNotificationService = $warrantyNotificationService;
    }

    #[Route('/add_opinion', name: 'add_opinion', methods: ['POST'])]
public function addOpinion(Request $request, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
{
    function sentimentAnalysisScore($comment, $lexiconName)
    {
        $analyzer = new Analyzer();
        $sentiment_overall = $analyzer->getSentiment($comment);

        switch ($lexiconName) {
            case "durability_rating":
                include 'C:\Users\lukas\Desktop\PI\backend\src\lexicon\durability_lexicon.php';
                $lexicon = $durability_words;
                $analyzer->updateLexicon($lexicon);
                break;
            case "price_rating":
                include 'C:\Users\lukas\Desktop\PI\backend\src\lexicon\price_lexicon.php';
                $lexicon = $price_words;
                $analyzer->updateLexicon($lexicon);
                break;
            case "capabilities_rating":
                include 'C:\Users\lukas\Desktop\PI\backend\src\lexicon\capabilities_lexicon.php';
                $lexicon = $capabilities_words;
                $analyzer->updateLexicon($lexicon);
                break;
            case "design_rating":
                include 'C:\Users\lukas\Desktop\PI\backend\src\lexicon\design_lexicon.php';
                $lexicon = $design_words;
                $analyzer->updateLexicon($lexicon);
                break;
            default:
                break;
        }

        $sentiment = $analyzer->getSentiment($comment);

        if ($sentiment_overall == $sentiment && $lexiconName != "overall_rating") {
            return null;
        }

        $scaled_score = ((($sentiment['compound'] + 1) / 2) * 10);

        return $scaled_score;
    }

    $data = json_decode($request->getContent(), true);

    $productId = $data['productId'] ?? null;
    if (!$productId) {
        return new JsonResponse(['error' => 'Product ID is required'], Response::HTTP_BAD_REQUEST);
    }

    try {
        $product = $this->em->getRepository(Product::class)->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $userEmail = $data['createdBy'] ?? null;
        if (!$userEmail) {
            return new JsonResponse(['error' => 'User Email is required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->em->getRepository(User::class)->find($userEmail);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $opinion = new Opinion();
        $opinion->setOpinionText($data['opinionText']);
        $opinion->setThumbsUp(0);
        $opinion->setThumbsDown(0);
        $opinion->setCreatedBy($user);

        $timezone = new \DateTimeZone('Europe/Warsaw');
        $now = new \DateTime('now', $timezone);
        $opinion->setCreatedAt($now);
        $opinion->setInspected(false);

        $opinion->setRating(sentimentAnalysisScore($data['opinionText'], "overall_rating"));
        $opinion->setDurabilityRating(sentimentAnalysisScore($data['opinionText'], "durability_rating"));
        $opinion->setPriceRating(sentimentAnalysisScore($data['opinionText'], "price_rating"));
        $opinion->setCapabilitiesRating(sentimentAnalysisScore($data['opinionText'], "capabilities_rating"));
        $opinion->setDesignRating(sentimentAnalysisScore($data['opinionText'], "design_rating"));

        $product->addOpinion($opinion);

        $this->em->persist($opinion);
        $this->em->flush();

        return new JsonResponse(['status' => 'Opinion added'], Response::HTTP_CREATED);
    } catch (\Exception $e) {
        return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}


    /*
            $w_neg = -1;
            $w_neu = 0;
            $w_pos = 1;
        
            $weighted_sum = ($sentiment['neg'] * $w_neg) + ($sentiment['neu'] * $w_neu) + ($sentiment['pos'] * $w_pos);
        

            $min_possible_value = -1;
            $max_possible_value = 1;
            $scaled_score = (($weighted_sum - $min_possible_value) / ($max_possible_value - $min_possible_value)) * 10;
            */
    

    #[Route('/thumbs-up', name: 'opinion_thumbs_up', methods: ['POST'])]
    public function thumbsUp(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $opinionId = $data['opinionId'];
        $user = $this->tokenAuthenticator->authenticateToken($request);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $opinion = $this->em->getRepository(Opinion::class)->find($opinionId);
        $reaction = $this->em->getRepository(UserOpinionReaction::class)->findOneBy(['voter' => $user, 'opinion' => $opinion]);

        if (!$opinion) {
            return new JsonResponse(['success' => false, 'message' => 'Opinion not found'], 404);
        }

        if ($reaction) {
            return new JsonResponse(['success' => false, 'message' => 'User has already reacted'], 400);
        }

        $userReaction = new UserOpinionReaction();
        $userReaction->setVoter($user);
        $userReaction->setOpinion($opinion);
        $userReaction->setReaction('up');
        $this->em->persist($userReaction);

        $opinion->setThumbsUp($opinion->getThumbsUp() + 1);
        $this->em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/thumbs-down', name: 'opinion_thumbs_down', methods: ['POST'])]
    public function thumbsDown(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $opinionId = $data['opinionId'];
        $user = $this->tokenAuthenticator->authenticateToken($request);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $opinion = $entityManager->getRepository(Opinion::class)->find($opinionId);
        $reaction = $entityManager->getRepository(UserOpinionReaction::class)->findOneBy(['voter' => $user, 'opinion' => $opinion]);

        if (!$opinion) {
            return new JsonResponse(['success' => false, 'message' => 'Opinion not found'], 404);
        }

        if ($reaction) {
            return new JsonResponse(['success' => false, 'message' => 'User has already reacted'], 400);
        }

        

        $opinion->setThumbsDown($opinion->getThumbsDown() + 1);
        $owner = $opinion->getCreatedBy();
        
        if ($opinion->getThumbsDown() >= 50) {
            $this->em->remove($opinion);
            $this->em->flush();
            $this->warrantyNotificationService->sendEmailAboutReactionOpinionDelete($owner, $opinion);
            return new JsonResponse(['success' => true]);
        }else{
            $userReaction = new UserOpinionReaction();
            $userReaction->setVoter($user);
            $userReaction->setOpinion($opinion);
            $userReaction->setReaction('down');
            $entityManager->persist($userReaction);
        }

        $this->em->persist($opinion);
        $this->em->flush();

        return new JsonResponse(['success' => true]);
    }

    #[Route('/uninspected', name: 'uninspected_opinions', methods: ['GET'])]
    public function getUninspectedOpinions(Request $request)
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $opinions = $this->opinionRepository->findUninspectedOpinions();
        $data = [];

        foreach ($opinions as $opinion) {
            $data[] = [
                'id' => $opinion->getId(),
                'opinionText' => $opinion->getOpinionText(),
                'rating' => $opinion->getRating(),
                'createdBy' => $opinion->getCreatedBy()->getUserIdentifier(),
                'thumbsDown' => $opinion->getThumbsDown(),
                'thumbsUp' => $opinion->getThumbsUp(),
                'createdAt' => $opinion->getCreatedAt()->format('Y-m-d H:i:s'),
                'productName' => $opinion->getProduct()->getProductName(),
                'productCategory' => $opinion->getProduct()->getCategory()->getCategoryName(),
            ];
        }

        return new JsonResponse($data);
    }


    #[Route('/inspect/accept/{id}', name: 'accept_opinion', methods: ['POST'])]
    public function acceptOpinion(Request $request, int $id): Response
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $opinion = $this->em->getRepository(Opinion::class)->find($id);
        if (!$opinion) {
            return new JsonResponse(['message' => 'Opinion not found'], Response::HTTP_NOT_FOUND);
        }

        $opinion->setInspected(true);
        $this->em->flush();

        return new JsonResponse(['message' => 'Opinion accepted']);
    }

    #[Route('/inspect/delete/{id}', name: 'delete_opinion', methods: ['DELETE'])]
    public function deleteOpinion(Request $request, int $id): Response
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }
        
        $opinion = $this->em->getRepository(Opinion::class)->find($id);
        if (!$opinion) {
            return new JsonResponse(['message' => 'Opinion not found'], Response::HTTP_NOT_FOUND);
        }
        $owner = $opinion->getCreatedBy();
        $this->warrantyNotificationService->sendEmailAboutOpinionDelete($owner, $opinion);

        $this->em->remove($opinion);
        $this->em->flush();

        return new JsonResponse(['message' => 'Opinion deleted']);
    }

    
}
