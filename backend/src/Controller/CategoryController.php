<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CategoryController extends AbstractController
{
    #[Route('/categories', name: 'get_categories', methods: ['GET'])]
    public function getCategories(EntityManagerInterface $em): JsonResponse
    {
        // Pobieranie wszystkich kategorii
        $categories = $em->getRepository(Category::class)->findAll();
    
        // Tworzenie mapy kategorii
        $categoryMap = [];
        foreach ($categories as $category) {
            $categoryId = $category->getId();
            $parentId = $category->getParentCategory() ? $category->getParentCategory()->getId() : null;
    
            if (!isset($categoryMap[$categoryId])) {
                $categoryMap[$categoryId] = [
                    'id' => $categoryId,
                    'name' => $category->getCategoryName(),
                    'description' => $category->getDescription(),
                    'parent' => $parentId,
                    'children' => []
                ];
            } else {
                $categoryMap[$categoryId]['name'] = $category->getCategoryName();
                $categoryMap[$categoryId]['description'] = $category->getDescription();
                $categoryMap[$categoryId]['parent'] = $parentId;
            }
    
            if ($parentId !== null) {
                if (!isset($categoryMap[$parentId]['children'])) {
                    $categoryMap[$parentId]['children'] = [];
                }
                $categoryMap[$parentId]['children'][] = &$categoryMap[$categoryId];
            }
        }
    
        // Znalezienie kategorii głównych (bez rodziców)
        $rootCategories = [];
        foreach ($categoryMap as $category) {
            if ($category['parent'] === null) {
                $rootCategories[] = $category;
            }
        }
    
        // Zwracanie odpowiedzi w formacie JSON
        return new JsonResponse($rootCategories);
    }
    
    
    
}
