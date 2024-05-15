<?php

namespace App\Entity;

use App\Repository\OpinionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OpinionRepository::class)]
class Opinion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $opinionText = null;

    #[ORM\Column]
    private ?float $rating = null;

    #[ORM\Column(nullable: true)]
    private ?int $thumbsUp = null;

    #[ORM\Column(nullable: true)]
    private ?int $thumbsDown = null;

    #[ORM\ManyToOne(inversedBy: 'opinions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'opinions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $createdBy = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOpinionText(): ?string
    {
        return $this->opinionText;
    }

    public function setOpinionText(string $opinionText): static
    {
        $this->opinionText = $opinionText;

        return $this;
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(float $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getThumbsUp(): ?int
    {
        return $this->thumbsUp;
    }

    public function setThumbsUp(?int $thumbsUp): static
    {
        $this->thumbsUp = $thumbsUp;

        return $this;
    }

    public function getThumbsDown(): ?int
    {
        return $this->thumbsDown;
    }

    public function setThumbsDown(?int $thumbsDown): static
    {
        $this->thumbsDown = $thumbsDown;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): static
    {
        $this->createdBy = $createdBy;

        return $this;
    }
}
