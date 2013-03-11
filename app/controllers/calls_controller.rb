class CallsController < ApplicationController

  respond_to :json

  def index
    @calls = Call.all
  end

  def show
    @call = Call.find(params[:id])
  end

  def create
    @call = Call.new(
      caller_session: params[:caller_session],
      caller_ice_candidate: params[:caller_ice_candidate]
    )
    @call.save
    render action: :show
  end

  def answer
    @call = Call.find(params[:id])
    @call.update_attributes(
      callee_session: params[:callee_session],
      callee_ice_candidate: params[:callee_ice_candidate]
    )
    render action: :show
  end

end
