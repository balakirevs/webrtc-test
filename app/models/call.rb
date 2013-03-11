class Call < ActiveRecord::Base
  attr_accessible :callee_session, :caller_session,
                  :callee_ice_candidate, :caller_ice_candidate
end
