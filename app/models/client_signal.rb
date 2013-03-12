class ClientSignal < ActiveRecord::Base
  attr_accessible :data, :signal_type, :read, :client_id, :call_id
end
