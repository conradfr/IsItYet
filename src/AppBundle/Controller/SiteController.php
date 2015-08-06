<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\Instance,
    AppBundle\Form\Type\InstanceType;

class SiteController extends Controller
{
    /**
     * @Route("/", name="home")
     * @Method({"GET"})
     */
    public function homeAction()
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/i/{publicKey}", name="instance_view")
     */
    public function viewAction($publicKey)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneByPublicKey($publicKey);

        if (!$instance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        $instanceExport = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance);

        return $this->render('default/instance.html.twig', [
            'instance' => $instanceExport
        ]);
    }
}
