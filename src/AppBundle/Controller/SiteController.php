<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use AppBundle\Entity\Instance;

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
    public function viewAction($publicKey, Request $request)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneByPublicKey($publicKey);

        if (!$instance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        $instanceExport = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance);

        /** Assuming for now that an ajax request wants json */
        if ($request->isXmlHttpRequest()) {
            $response = new JsonResponse();
            $response->setData($instanceExport);
            return $response;
        }

        return $this->render('default/instance.html.twig', [
            'instance' => $instanceExport
        ]);
    }

    /**
     * @Route("/dropdown", name="instances_dropdown")
     */
    public function dropdownAction()
    {
        return $this->render(':mixins:instances-dropdown.html.twig', []);
    }
}
