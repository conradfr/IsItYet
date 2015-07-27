<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;

use AppBundle\Entity\Instance,
    AppBundle\Entity\Boolean as InstanceBoolean,
    AppBundle\Form\Type\InstanceType;

class DefaultController extends Controller
{
    /**
     * @Route("/instance/{publicKey}/{writeKey}", name="app", defaults={"publicKey"="", "writeKey"=""})
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
        $responseData = [];

        // Type validation (pre-form)
        $instanceTypeParam = $request->request->get('type', '');
        $typeConstraint = new Assert\Choice();
        $typeConstraint->choices = [Instance::TYPE_BOOLEAN, Instance::TYPE_COUNTDOWN];

        $instanceTypeError = $this->get('validator')->validate(
            $instanceTypeParam,
            $typeConstraint
        );

        if (count($instanceTypeError) > 0) {
            throw $this->createAccessDeniedException('Error');
        }

        $instanceTypeClass = "AppBundle\\Entity\\" . ucfirst($instanceTypeParam);
        $instance = new $instanceTypeClass();

        $form = $this->createForm(new instanceType(), $instance);

        // $form->handleRequest($request);
//        $form->submit($request->request->all(), false);
        $form->submit($request->request->all());

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($instance);
            $em->flush();

            // Construct response
            $responseData = [
                'data' => [
                    'title' => $instance->getTitle(),
                    'textFalse' => $instance->getTextFalse(),
                    'textTrue' => $instance->getTextTrue(),
                ],
                'meta' => [
                    'publicKey' => $instance->getPublicKey(),
                    'writeKey' => $instance->getWriteKey(),
                    'editLink' => $this->generateUrl('app', ['publicKey' => $instance->getPublicKey(), 'writeKey' => $instance->getWriteKey()], true)
/*                    'id' => $->getId(),
                    'key' => $macro->getKey(), // used for delete access
                    'directLink' => 'http://cdn.pierre-generator.funkybits.fr/' . $macro->getId() . '.png',
                    'pageLink' => $this->generateUrl('macro_page_short', ['id' => $macro->getId()], true),
                    'deleteLink' => $this->generateUrl('delete_page', ['id' => $macro->getId(), 'key' => $macro->getKey()], true)*/
                ],
                'status' => [
                    'created' => true,
                    'error' => false,
                    'deleted' => false
                ]
            ];

            if ($instanceTypeParam === 'boolean') {
                $responseData['data']['status'] = false;
            }
            elseif ($instanceTypeParam === 'countdown') {

            }

            $response->setData($responseData);
        } else {
            $response->setStatusCode(400)
                ->setData([
                    'data' => [
                        'title' => $instance->getTitle(),
                        'textFalse' => $instance->getTextFalse(),
                        'textTrue' => $instance->getTextTrue(),
                    ],
                    'meta' => [

                    ],
                    'status' => [
                        'created' => false,
                        'deleted' => false,
                        'error' => true,
                        'errors' => $this->get('form_serializer')->serializeFormErrors($form, false, false)['fields']
                    ]
                ]);
        }

        return $response;
    }

    /**
     * @Route("/i/{publicKey}/{writeKey}", name="instance_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction($publicKey, $writeKey)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        return $this->render('default/delete.html.twig', [
            'instance' => $instance
        ]);
    }

    /**
    * @Route("/i/{key}", name="instance_view")
    */
    public function viewAction($key)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneByPublicKey($key);

        if (!$instance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        return $this->render('default/instance.html.twig', [
            'instance' => ['data' => $instance]
        ]);
    }

    /**
     * @Route("/i/{publicKey}/{writeKey}", name="instance_delete")
     * @Method({"DELETE"})
     */
    public function deleteAction()
    {
        $em = $this->getDoctrine()->getManager();

        $response = new JsonResponse();

        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $response->setStatusCode(404);
        } else {
            $em->remove($instance);
            $em->flush();

            $response->setData(['delete' => true]);
        }

        return $response;
    }

    /**
     * @Route("/instance/status/{publicKey}/{writeKey}", name="instance_delete")
     * @Method({"POST"})
     */
    public function statusAction($publicKey, $writeKey, Request $request)
    {
        // Status type validation (boolean)
        $statusParam = $request->request->get('status', '');
        $typeConstraint = new Assert\Type(array(
            'type'    => 'boolean'
        ));

        $typeError = $this->get('validator')->validate(
            $statusParam,
            $typeConstraint
        );

        if (count($typeError) > 0) {
            throw $this->createAccessDeniedException('Error');
        }

        $response = new JsonResponse();
        $responseData = [];
        $em = $this->getDoctrine()->getManager();

        /** @var InstanceBoolean $instance */
        $instance = $this->getDoctrine()->getRepository('AppBundle:Boolean')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $response->setStatusCode(404);
        } else {
            $instance->setStatus($statusParam);
            $em->flush();

            $responseData = ['data' => ['status' => $statusParam]];
            $serializer = $this->get('jms_serializer');

            /** @var \Predis\Client */
            $redis = $this->container->get('snc_redis.default');
            $redis->PUBLISH($instance->getPublicKey(), $serializer->serialize($responseData, 'json'));

            $response->setData($responseData);
        }

        return $response;
    }
}
