# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create!(username: 'andre', email: "a@mit.edu", password: 'password')
User.create!(username: 'chongyuan', email: "c@mit.edu", password: 'password')
User.create!(username: 'lucy', email: "l@mit.edu", password: 'password')
User.create!(username: 'yang', email: "y@mit.edu", password: 'password')
