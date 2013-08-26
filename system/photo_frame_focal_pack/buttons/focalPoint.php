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

		$manipulation  = isset($manipulations->focalpoint) ? $manipulations->focalpoint->data : array();

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
}