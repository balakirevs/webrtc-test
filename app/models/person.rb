class Person < ActiveRecord::Base

  attr_accessible :name

  def active_call
    calls = Call.where('(caller_id = ? AND status < 2) OR (callee_id = ? AND status = 1)', id, id)
    calls.first unless calls.empty?
  end

  def waiting_calls
    calls = Call.where('callee_id = ? AND status = 0', id)
    calls
  end

end
