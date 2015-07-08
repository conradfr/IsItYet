<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InstanceType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text', [
                'error_bubbling' => false
            ])
            ->add('type', 'choice', [
                'choices'  => ['boolean' => 'boolean', 'countdown' => 'countdown']
            ])
            ->add('type', 'datetime')
            ->add('first_state', 'text')
            ->add('second_state', 'text');
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "allow_extra_fields" => true,
            'csrf_protection' => false
        ));
    }

    public function getName() {
        return 'Instance';
    }
}