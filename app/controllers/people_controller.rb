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
  end

end
