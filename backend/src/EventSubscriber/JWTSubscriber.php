<?php
namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use App\Entity\User;

class JWTSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            JWTCreatedEvent::class => 'onJWTCreated',
        ];
    }

    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Agrega un registro de depuración
        error_log('onJWTCreated called');

        // Obtén el usuario autenticado
        $user = $event->getUser();

        if (!$user instanceof User) {
            return;
        }

        // Obtén el payload actual del token
        $payload = $event->getData();
        
        // Agrega el email al payload
        $payload['username'] = $user->getUsername();

        // Establece el nuevo payload con el email
        $event->setData($payload);
    }
}