class Call < ActiveRecord::Base

  attr_accessible :status, :caller_id, :callee_id

  belongs_to :caller, class_name: Person
  belongs_to :callee, class_name: Person

end
