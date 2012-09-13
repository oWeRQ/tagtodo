<?php

/**
 * This is the model class for table "users".
 *
 * The followings are the available columns in table 'users':
 * @property integer $id
 * @property string $email
 * @property string $first_name
 * @property string $last_name
 * @property string $provider
 * @property string $uid
 */
class User extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return User the static model class
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
		return 'users';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('email, first_name, last_name, provider, uid', 'length', 'max'=>255),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, email, first_name, last_name, provider, uid, tasksCount, tagsCount', 'safe', 'on'=>'search'),
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
			'tasks'=>array(self::HAS_MANY, 'Task', 'user_id'),
			'tasksCount'=>array(self::STAT, 'Task', 'user_id'),
			'tags'=>array(self::HAS_MANY, 'Tag', 'user_id'),
			'tagsCount'=>array(self::STAT, 'Tag', 'user_id'),
		);
	}

	public function behaviors()
	{
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
			'email' => 'Email',
			'first_name' => 'First Name',
			'last_name' => 'Last Name',
			'provider' => 'Provider',
			'uid' => 'UID',
			'tasksCount' => 'Tasks Count',
			'tagsCount' => 'Tags Count',
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

		$criteria->with = array('tasksCount', 'tagsCount');
		$criteria->select = '*, count(tasks.id) as tasksCount, count(tags.id) as tagsCount';
		$criteria->join = 'LEFT JOIN tasks ON t.id=tasks.user_id LEFT JOIN tags ON t.id=tags.user_id';
		$criteria->group = 't.id';

		$criteria->compare('id',$this->id);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('first_name',$this->first_name,true);
		$criteria->compare('last_name',$this->last_name,true);
		$criteria->compare('provider',$this->provider,true);
		$criteria->compare('uid',$this->uid,true);
		if ($this->tasksCount != null)
			$criteria->compare('tasksCount',$this->tasksCount);
		if ($this->tagsCount != null)
			$criteria->compare('tagsCount',$this->tagsCount);
		//var_dump($criteria);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
			'sort'=>array(
				'attributes'=>array(
					'*',
					'tasksCount'=>array(
						'asc'=>'tasksCount ASC',
						'desc'=>'tasksCount DESC',
					),
					'tagsCount'=>array(
						'asc'=>'tagsCount ASC',
						'desc'=>'tagsCount DESC',
					),
				),
			),
		));
	}
}