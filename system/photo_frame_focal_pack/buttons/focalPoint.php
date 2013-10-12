<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class FocalPointButton extends PhotoFrameButton {
	
	public $name = 'Focal Point';
	
	public $moduleName = 'photo_frame_focal_pack';
	
	public $className = 'FocalPoint';


	public function javascript()
	{
		return array('focalPoint');
	}

	public function css()
	{
		return array('focalPoint');
	}

	public function parseVars($vars)
	{
		$manipulations = json_decode($vars['manipulations']);

		$manipulation  = isset($manipulations->focalpoint) ? $manipulations->focalpoint->data : (object) array(
			'x' => 0,
			'y' => 0
		);

		$vars['focal_point'] = array(array(
			'x' 	  => $manipulation->x,
			'y'		  => $manipulation->y,
			'focal:x' => $manipulation->x,
			'focal:y' => $manipulation->y
		));

		$vars['focal_point:x'] = $manipulation->x;
		$vars['focal_point:y'] = $manipulation->y;

		return $vars;
	}

	public function render($manipulation = array())
	{
		
	}

	public function settings($data)
	{
		return array(
			'photo_frame_disable_regular_crop' => array(
				'label' 	  => 'Allow Only Focal Cropping?',
				'description' => 'If yes, this will disable the default cropping utility and only allow users to set a focal point.',
				'type'        => 'select',
				'settings'    => array(
					'options' => array(
						'true'  => 'True',
						'false' => 'False',
					)
				)
			)
		);
	}
}