<?php

/**
 * This is the model class for table "tasks".
 *
 * The followings are the available columns in table 'tasks':
 * @property integer $id
 * @property string $body
 * @property integer $createdAt
 * @property integer $updatedAt
 */
class Task extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Task the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'tasks';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('body', 'required'),
			array('deadline, tags', 'safe'),
			array('createdAt, updatedAt', 'numerical', 'integerOnly'=>true),
			array('body', 'length', 'max'=>1024),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, body, createdAt, updatedAt, deadline', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'tags'=>array(self::MANY_MANY, 'Tag', 'tasks_tags(task_id, tag_id)'),
		);
	}

	public function behaviors(){
		return array(
			'CTimestampBehavior' => array(
				'class' => 'zii.behaviors.CTimestampBehavior',
				'createAttribute' => 'createdAt',
				'updateAttribute' => 'updatedAt',
				'setUpdateOnCreate' => true,
			)
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'body' => 'Body',
			'createdAt' => 'Created At',
			'updatedAt' => 'Updated At',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('body',$this->body,true);
		$criteria->compare('createdAt',$this->createdAt);
		$criteria->compare('updatedAt',$this->updatedAt);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	public function hasAttribute($name)
	{
		if ($name == 'tags')
			return true;

		return parent::hasAttribute($name);
	}

	public function afterSave()
	{
		TaskTags::model()->deleteAllByAttributes(array(
			'task_id' => $this->id,
		));
		foreach ($this->tags as $tag) {
			if (is_numeric($tag))
				$tag = Tag::model()->findByPk($tag);

			if (is_object($tag)) {
				$taskTag = new TaskTags();
				$taskTag->task_id = $this->id;
				$taskTag->tag_id = $tag->id;
				$taskTag->save();
			}
		}
		parent::afterSave();
	}

	public function toJSON()
	{
		$data = $this->attributes;
		$data['tags'] = array();
		foreach($this->tags as $tag) {
			$data['tags'][] = $tag->id;
		}
		return $data;
	}
}