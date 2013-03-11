class CreateClientSignals < ActiveRecord::Migration
  def change
    create_table :client_signals do |t|
      t.string :signal_type
      t.text :data
      t.integer :read, default: 0

      t.timestamps
    end
  end
end
