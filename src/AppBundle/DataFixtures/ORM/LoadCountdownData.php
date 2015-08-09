<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Countdown;

class LoadCountdownData implements FixtureInterface, ContainerAwareInterface
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
        $instance =  $this->container->get('doctrine')->getRepository('AppBundle:Countdown')->findOneBy(['publicKey' => 'countdown-demo', 'writeKey' => '4ae51a53-c64a-43da-9284-278e0ad53120']);

        if (!$instance) {
            $instance = new Countdown();
        }

        $instance->setTitle("Is the end of the countdown reached ?");

        $instance->setEndAt(new \DateTime('2016-01-01T00:00:00+0200'));

        $instance->setPublicKey('countdown-demo');
        $instance->setWriteKey('4ae51a53-c64a-43da-9284-278e0ad53120');

        $instance->setIsDemo(true);

        $manager->persist($instance);
        $manager->flush();
    }
}