<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\Instance,
    AppBundle\Form\Type\InstanceType;

class DefaultController extends Controller
{
    /**
     * @Route("/instance", name="app")
     * @Method({"GET"})
     */
    public function appAction()
    {
        return $this->render('default/app.html.twig');
    }

    /**
     * @Route("/instance", name="instance_submit")
     * @Method({"POST"})
     */
    public function submitAction(Request $request)
    {
        $response = new JsonResponse();

        $instance = new Instance();
        $form = $this->createForm(new instanceType(), $instance);

        // $form->handleRequest($request);
        $form->submit($request->request->all());

        if ($form->isValid()) {



            // Construct response
            $response->setData([
                'meta' => [
/*                    'id' => $->getId(),
                    'key' => $macro->getKey(), // used for delete access
                    'directLink' => 'http://cdn.pierre-generator.funkybits.fr/' . $macro->getId() . '.png',
                    'pageLink' => $this->generateUrl('macro_page_short', ['id' => $macro->getId()], true),
                    'deleteLink' => $this->generateUrl('delete_page', ['id' => $macro->getId(), 'key' => $macro->getKey()], true)*/
                ],
                'status' => [
                    'created' => true,
                    'error' => false
                ]
            ]);
        } else {
            $response->setStatusCode(400)
                ->setData([
                    'meta' => [

                    ],
                    'status' => [
                        'created' => false,
                        'error' => true,
                        'errorText' => 'Erreur : ' . $form->getErrors(true, false)->current()->getMessage() // only display one error at a time (should not be many anyway)
                    ]
                ]);
        }

        return $response;
    }

    /**
     * @Route("/i/{key}", name="instance_view")
     */
    public function viewAction($key)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneByPublicKey($key);

        return $this->render('default/instance.html.twig', [
            'instance' => $instance
        ]);
    }
}
