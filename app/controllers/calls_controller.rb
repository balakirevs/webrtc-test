class CallsController < ApplicationController

  def answer
    call = Call.find(params[:id])
    call.update_attribute(:status, 1)
    ClientSignal.create(
      signal_type: 'pickup',
      data: '',
      call_id: call.id,
      client_id: call.callee.id
    )
    redirect_to controller: :people, action: :me
  end

  def hangup
    call = Call.find(params[:id])
    call.update_attribute(:status, 2)

    # Send both a signal to hangup
    ClientSignal.create(
      signal_type: 'hangup',
      data: '',
      call_id: call.id,
      client_id: call.callee.id
    )
    ClientSignal.create(
      signal_type: 'hangup',
      data: '',
      call_id: call.id,
      client_id: call.caller.id
    )
    redirect_to controller: :people, action: :me
  end

end
