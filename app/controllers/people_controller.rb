class PeopleController < ApplicationController

  def new
    @person = Person.new
  end

  def create
    @person = Person.new(params[:person])
    if @person.save
      session[:person_id] = @person.id
      redirect_to action: :me
    else
      render action: :new
    end
  end

  def me
    @person = Person.find(session[:person_id])
    @people = Person.where('id != ?', session[:person_id])
  end

  def call
    Call.create(
      caller_id: session[:person_id],
      callee_id: params[:id]
    )
    redirect_to action: :me
  end

end
