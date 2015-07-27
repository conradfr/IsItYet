<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use AppBundle\Entity\Instance;

class InstanceType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('type', 'choice', [
                'choices'  => ['boolean' => 'boolean', 'countdown' => 'countdown'],
                'mapped' => false,
                'error_bubbling' => false
            ])

            ->add('title', 'text', [
                'error_bubbling' => false
            ])

            ->add('createdBy', 'text', [
                'error_bubbling' => false
            ])

            ->add('textFalse', 'text', [
                'error_bubbling' => false
            ])
            ->add('textTrue', 'text', [
                'error_bubbling' => false
            ]);

            $builder->addEventListener(FormEvents::PRE_SUBMIT , function (FormEvent $event) {
                $form = $event->getForm();

                if($form->get('type') === 'countdown') {
                    $form->add('endAt', 'datetime', [
                        'error_bubbling' => false
                    ]);
                }
            });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "allow_extra_fields" => true,
            'csrf_protection' => false,
            'validation_groups' => function (FormInterface $form) {
                $data = $form->get('type')->getData();
                return [ucfirst($data), 'Default'];
            }
        ));
    }

    public function getName() {
        return 'Instance';
    }
}