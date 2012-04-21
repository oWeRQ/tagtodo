<?php

/**
 * This is the model class for table "tags".
 *
 * The followings are the available columns in table 'tags':
 * @property integer $id
 * @property string $name
 * @property integer $createdAt
 * @property integer $updatedAt
 */
class Tag extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Tag the static model class
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
		return 'tags';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name', 'required'),
			array('tasks', 'safe'),
			array('createdAt, updatedAt', 'numerical', 'integerOnly'=>true),
			array('name', 'length', 'max'=>1024),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, name, createdAt, updatedAt', 'safe', 'on'=>'search'),
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
			'tasks'=>array(self::MANY_MANY, 'Task', 'tasks_tags(tag_id, task_id)'),
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
			'name' => 'Name',
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
		$criteria->compare('name',$this->name,true);
		$criteria->compare('createdAt',$this->createdAt);
		$criteria->compare('updatedAt',$this->updatedAt);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	public function hasAttribute($name)
	{
		if ($name == 'tasks')
			return true;

		return parent::hasAttribute($name);
	}

	public function afterSave()
	{
		TaskTags::model()->deleteAllByAttributes(array(
			'tag_id' => $this->id,
		));
		foreach ($this->tasks as $task) {
			if (is_numeric($task))
				$task = Task::model()->findByPk($task);

			if (is_object($task)) {
				$taskTag = new TaskTags();
				$taskTag->task_id = $task->id;
				$taskTag->tag_id = $this->id;
				$taskTag->save();
			}
		}
		parent::afterSave();
	}

	public function toJSON()
	{
		$data = $this->attributes;
		$data['tasks'] = array();
		foreach($this->tasks as $task) {
			$data['tasks'][] = $task->id;
		}
		return $data;
	}
}