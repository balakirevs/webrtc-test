class Call < ActiveRecord::Base

  attr_accessible :name

  has_one :caller, class_name: Person
  has_one :callee, class_name: Person

end
