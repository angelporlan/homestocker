<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[ORM\Column(nullable: true)]
    private ?int $total_quantity = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $photo = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?House $house = null;

    /**
     * @var Collection<int, ProductDetail>
     */
    #[ORM\OneToMany(targetEntity: ProductDetail::class, mappedBy: 'product', orphanRemoval: true)]
    private Collection $expiration_dates;

    public function __construct()
    {
        $this->expiration_dates = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getTotalQuantity(): ?int
    {
        return $this->total_quantity;
    }

    public function setTotalQuantity(?int $total_quantity): static
    {
        $this->total_quantity = $total_quantity;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getHouse(): ?House
    {
        return $this->house;
    }

    public function setHouse(?House $house): static
    {
        $this->house = $house;

        return $this;
    }

    /**
     * @return Collection<int, ProductDetail>
     */
    public function getExpirationDates(): Collection
    {
        return $this->expiration_dates;
    }

    public function addExpirationDate(ProductDetail $expirationDate): static
    {
        if (!$this->expiration_dates->contains($expirationDate)) {
            $this->expiration_dates->add($expirationDate);
            $expirationDate->setProduct($this);
        }

        return $this;
    }

    public function removeExpirationDate(ProductDetail $expirationDate): static
    {
        if ($this->expiration_dates->removeElement($expirationDate)) {
            // set the owning side to null (unless already changed)
            if ($expirationDate->getProduct() === $this) {
                $expirationDate->setProduct(null);
            }
        }

        return $this;
    }
}
