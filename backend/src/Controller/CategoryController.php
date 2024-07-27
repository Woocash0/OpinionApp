<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CategoryController extends AbstractController
{
    #[Route('/categories', name: 'get_categories', methods: ['GET'])]
    public function getCategories(EntityManagerInterface $em): JsonResponse
    {
        $categories = $em->getRepository(Category::class)->findAll();
        
        $categoryMap = [];
        foreach ($categories as $category) {
            $categoryMap[$category->getId()] = [
                'id' => $category->getId(),
                'name' => $category->getCategoryName(),
                'description' => $category->getDescription(),
                'parent' => $category->getParentCategory() ? $category->getParentCategory()->getId() : null,
                'children' => []
            ];
        }
        
        $rootCategories = [];
        foreach ($categoryMap as $categoryId => &$category) {
            $parentId = $category['parent'];
            if ($parentId === null) {
                $rootCategories[$categoryId] = &$category;
            } else {
                if (isset($categoryMap[$parentId])) {
                    $categoryMap[$parentId]['children'][] = &$category;
                } else {
                    $categoryMap[$parentId] = [
                        'id' => $parentId,
                        'name' => '',
                        'description' => '',
                        'parent' => null,
                        'children' => [&$category]
                    ];
                    $rootCategories[$parentId] = &$categoryMap[$parentId];
                }
            }
        }

        function sortChildren(&$categories) {
            foreach ($categories as &$category) {
                if (!empty($category['children'])) {
                    usort($category['children'], function ($a, $b) {
                        return strcmp($a['name'], $b['name']);
                    });
                    sortChildren($category['children']);
                }
            }
        }
        
        usort($rootCategories, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });

        sortChildren($rootCategories);

        return new JsonResponse(array_values($rootCategories));
    }
}
