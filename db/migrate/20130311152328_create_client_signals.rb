class CreateClientSignals < ActiveRecord::Migration
  def change
    create_table :client_signals do |t|
      t.string :type
      t.text :data
      t.integer :read

      t.timestamps
    end
  end
end