class Person < ActiveRecord::Base
  attr_accessible :name

  has_many :hosted_calls, class_name: Call, foreign_key: :caller_id
  has_many :answered_calls, class_name: Call, foreign_key: :callee_id
end
