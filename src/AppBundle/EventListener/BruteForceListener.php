<?php

namespace AppBundle\EventListener;

use AppBundle\Controller\BruteForceProtectionController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class BruteForceListener
{
    /** @var \Predis\Client */
    protected $redis;

    public function __construct($redis)
    {
        $this->redis = $redis;
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $controller = $event->getController();

        /*
         * $controller passed can be either a class or a Closure.
         * This is not usual in Symfony but it may happen.
         * If it is a class, it comes in array format
         */
        if (!is_array($controller)) {
            return;
        }

        if ($controller[0] instanceof BruteForceProtectionController) {
            
            $ipIsListed = $this->redis->GET('bruteforce_' . $event->getRequest()->getClientIp());

            if ($ipIsListed !== null) {
                 throw new AccessDeniedHttpException('The requested instance has not been found.');
            }
        }
    }
}