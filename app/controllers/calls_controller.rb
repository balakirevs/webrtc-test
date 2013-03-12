class CallsController < ApplicationController

  def answer
    call = Call.find(params[:id])
    call.update_attribute(:status, 1)
    redirect_to controller: :people, action: :me
  end

  def hangup
    call = Call.find(params[:id])
    call.update_attribute(:status, 2)
    redirect_to controller: :people, action: :me
  end

end
