<?php

namespace App\Entity;

use App\Repository\HouseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HouseRepository::class)]
class House
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'houses')]
    private Collection $users;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'house', orphanRemoval: true)]
    private Collection $products;

    /**
     * @var Collection<int, ShoppingList>
     */
    #[ORM\OneToMany(targetEntity: ShoppingList::class, mappedBy: 'house', orphanRemoval: true)]
    private Collection $shoppingLists;

    /**
     * @var Collection<int, ProductHistory>
     */
    #[ORM\OneToMany(targetEntity: ProductHistory::class, mappedBy: 'house', orphanRemoval: true)]
    private Collection $productHistories;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->shoppingLists = new ArrayCollection();
        $this->productHistories = new ArrayCollection();
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

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): static
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
            $user->addHouse($this);
        }

        return $this;
    }

    public function removeUser(User $user): static
    {
        if ($this->users->removeElement($user)) {
            $user->removeHouse($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): static
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->setHouse($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): static
    {
        if ($this->products->removeElement($product)) {
            // set the owning side to null (unless already changed)
            if ($product->getHouse() === $this) {
                $product->setHouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ShoppingList>
     */
    public function getShoppingLists(): Collection
    {
        return $this->shoppingLists;
    }

    public function addShoppingList(ShoppingList $shoppingList): static
    {
        if (!$this->shoppingLists->contains($shoppingList)) {
            $this->shoppingLists->add($shoppingList);
            $shoppingList->setHouse($this);
        }

        return $this;
    }

    public function removeShoppingList(ShoppingList $shoppingList): static
    {
        if ($this->shoppingLists->removeElement($shoppingList)) {
            // set the owning side to null (unless already changed)
            if ($shoppingList->getHouse() === $this) {
                $shoppingList->setHouse(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProductHistory>
     */
    public function getProductHistories(): Collection
    {
        return $this->productHistories;
    }

    public function addProductHistory(ProductHistory $productHistory): static
    {
        if (!$this->productHistories->contains($productHistory)) {
            $this->productHistories->add($productHistory);
            $productHistory->setHouse($this);
        }

        return $this;
    }

    public function removeProductHistory(ProductHistory $productHistory): static
    {
        if ($this->productHistories->removeElement($productHistory)) {
            // set the owning side to null (unless already changed)
            if ($productHistory->getHouse() === $this) {
                $productHistory->setHouse(null);
            }
        }

        return $this;
    }
}
