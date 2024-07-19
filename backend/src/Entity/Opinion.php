<?php

namespace App\Entity;

use App\Repository\OpinionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    private ?int $thumbsUp = 0;

    #[ORM\Column(nullable: true)]
    private ?int $thumbsDown = 0;

    #[ORM\ManyToOne(inversedBy: 'opinions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'opinions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $createdBy = null;

    #[ORM\Column(nullable: true)]
    private ?float $durability_rating = null;

    #[ORM\Column(nullable: true)]
    private ?float $design_rating = null;

    #[ORM\Column(nullable: true)]
    private ?float $price_rating = null;

    #[ORM\Column(nullable: true)]
    private ?float $capabilities_rating = null;

    #[ORM\OneToMany(mappedBy: 'opinion', targetEntity: UserOpinionReaction::class, orphanRemoval: true)]
    private Collection $userOpinionReactions;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    public function __construct()
    {
        $this->userOpinionReactions = new ArrayCollection();
    }

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

    public function getDurabilityRating(): ?float
    {
        return $this->durability_rating;
    }

    public function setDurabilityRating(?float $durability_rating): static
    {
        $this->durability_rating = $durability_rating;

        return $this;
    }

    public function getDesignRating(): ?float
    {
        return $this->design_rating;
    }

    public function setDesignRating(?float $design_rating): static
    {
        $this->design_rating = $design_rating;

        return $this;
    }

    public function getPriceRating(): ?float
    {
        return $this->price_rating;
    }

    public function setPriceRating(?float $price_rating): static
    {
        $this->price_rating = $price_rating;

        return $this;
    }

    public function getCapabilitiesRating(): ?float
    {
        return $this->capabilities_rating;
    }

    public function setCapabilitiesRating(?float $capabilities_rating): static
    {
        $this->capabilities_rating = $capabilities_rating;

        return $this;
    }

    /**
     * @return Collection<int, UserOpinionReaction>
     */
    public function getUserOpinionReactions(): Collection
    {
        return $this->userOpinionReactions;
    }

    public function addUserOpinionReaction(UserOpinionReaction $userOpinionReaction): static
    {
        if (!$this->userOpinionReactions->contains($userOpinionReaction)) {
            $this->userOpinionReactions->add($userOpinionReaction);
            $userOpinionReaction->setOpinion($this);
        }

        return $this;
    }

    public function removeUserOpinionReaction(UserOpinionReaction $userOpinionReaction): static
    {
        if ($this->userOpinionReactions->removeElement($userOpinionReaction)) {
            // set the owning side to null (unless already changed)
            if ($userOpinionReaction->getOpinion() === $this) {
                $userOpinionReaction->setOpinion(null);
            }
        }

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
