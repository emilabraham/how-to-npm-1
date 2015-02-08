var reg = require('../lib/registry.js')

exports.problem = function () {
  reg.run('login')

  return function () { /*
As much fun as it is to install modules, npm is best when you
can be a part of it.  That starts with creating an account.

Because this is just a tutorial adventure, remember, we're not
*actually* creating an account anywhere.  However, when you run
this in the Real World, it'll create a real account, with a page
on npmjs.com and the ability to publish packages that real live
humans can install and enjoy.

To see who you're logged in as, run `npm whoami`

To create your account, run `npm adduser`

Try it now, and open the door to ever-greater module fun times!
*/}.toString().split('\n').slice(1,-1).join('\n')
}

var shop = require('../')
var fs = require('fs')
var path = require('path')

exports.verify = function (args, cb) {
  //TODO: DRY this up.  It's getting rather tedious.
  var datadir = shop.datadir
  // verify we're in the right folder
  var cwd = fs.readFileSync(path.resolve(datadir, 'cwd'), 'utf8').trim()

  if (cwd !== process.cwd()) {
    console.log('Uh oh!\n'+
                'It looks like you are in the wrong folder.\n'+
                'Please cd into ' + cwd +'\n'+
                'and then try again')
    return cb(false)
  }

  // test who we are with whoami
  var exec = require('child_process').exec
  var npm = require('which').sync('npm')
  exec(npm + ' whoami', function (er, stdout, stderr) {
    if (er) {
      process.stdout.write(stdout)
      process.stderr.write(stderr)

      console.log('\nUh oh!\n' +
                  'It looks like something went wrong')
      return cb(false)
    }

    stdout = (stdout + '').trim()
    if (stdout.match(/Not authed.  Run 'npm adduser'/)) {
      console.log('Hm... I don\'t see a login here\n'+
                  'Did you run `npm adduser` to create the account?')
      return cb(false)
    }

    console.log('Congratulations, %s!', stdout)
    console.log('You are the proud owner of an imaginary new npm account!\n'+
                'Use it wisely.  Never in anger.  Always for the Good.\n'+
                '\n' +
                'With this sweet power comes much responsibility, which is\n'+
                'sufficiently different from Spiderman\'s thing that Marvel\n'+
                'hopefully won\'t sue us.\n\nExcelsior!')

    reg.kill()
    return cb(true)
  })
}
