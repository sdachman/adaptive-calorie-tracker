from app import create_app

####
# this imports my app factory, creates the app, and runs it. debug =True means flask will auto restart whenever
#I save a file -- very usefull for development
####
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)