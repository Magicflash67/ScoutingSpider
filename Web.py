from flask import Flask
app = Flask(__name__)

@app.route('/')
def load_start():
    return open('Leaderbored.html').read()

@app.route('/Leaderbored.html')
def loadLeaderbored():
    return open('Leaderbored.html').read()

@app.route('/Matches.html')
def loadMatches():
    return open('Matches.html').read()

@app.route('/Team.html')
def loadTeams():
    return open('Team.html').read()



if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)
