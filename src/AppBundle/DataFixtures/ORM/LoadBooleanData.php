<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Boolean;

class LoadBooleanData implements FixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * {@inheritDoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        // 'upsert'
        $instance =  $this->container->get('doctrine')->getRepository('AppBundle:Boolean')->findOneBy(['publicKey' => 'boolean-demo', 'writeKey' => '4ae51a53-c64a-43da-9284-278e0ad53120']);

        if (!$instance) {
            $instance = new Boolean();
        }

        $instance->setTitle("Is this a test of IsItYet ?");
        $instance->setStatus(false);

        $instance->setPublicKey('boolean-demo');
        $instance->setWriteKey('4ae51a53-c64a-43da-9284-278e0ad53120');

        $instance->setIsDemo(true);
        $instance->setCreatedBy('IsItYet demo');

        $manager->persist($instance);
        $manager->flush();
    }
}