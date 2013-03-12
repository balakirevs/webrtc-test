class PeopleController < ApplicationController

  def new
    @person = Person.new
  end

  def create
    @person = Person.find_or_create_by_name(params[:person][:name])
    if @person.save
      session[:person_id] = @person.id
      redirect_to action: :me
    else
      render action: :new
    end
  end

  def me
    @person = Person.find_by_id(session[:person_id])
    @people = Person.where('id != ?', session[:person_id])
    if @person.nil?
      redirect_to action: :new
    end
  end

  def call
    Call.create(
      caller_id: session[:person_id],
      callee_id: params[:id]
    )
    redirect_to action: :me
  end

end
