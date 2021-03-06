const {expect} = require('chai');
const sinon = require('sinon');
const knownPaths = require('../../_ng/utils/known_paths');

const {ResourceSubGenerator} = require('../../_ng/client/sub_generators_resource');

describe('ResourceSubGenerator', () => {
  describe('creation', () => {
    it('should have the right param passed to wrapper', () => {
      let _gen = {
        a: true,
        config: {
          get(){
            return 'ng1'
          }
        }
      };
      let _rsg = new ResourceSubGenerator(_gen);

      expect(_rsg.generator).to.equal(_gen);
    });
  });

  describe('initializing', () => {
    it('should have the initializing called with the right stuff', () => {
      let _gen = {
        argument: () => {},
        config: {
          get(){
            return 'ng1'
          }
        }
      };

      let _rsg = new ResourceSubGenerator(_gen);

      _rsg.initializing();

      expect(_rsg.generator.argument).to.have.been.called;
    });
  });

  describe('writing', () => {
    it('should throw FeatureMissingError', () => {
      let _gen = {
        name: 'a',
        appName: 'a',
        config: {
          get(){
            return 'ng1'
          }
        },
        options: {},
        template: sinon.spy()
      };

      let _rsg = new ResourceSubGenerator(_gen);

      expect(() => _rsg.writing()).to.throw(Error, /Do it like this: --feature something-here/);
    });

    it('should throw ModuleDoesntImplementError', () => {
      let _gen = {
        name: 'a',
        appName: 'a',
        config: {
          get(){
            return 'ng2'
          }
        },
        options: {
          feature: 'c'
        },
        template: sinon.spy()
      };

      let _rsg = new ResourceSubGenerator(_gen);

      expect(() => _rsg.writing()).to.throw(Error, /ng2 doesn't implement resource/);
    });

    it('should have the writing called with the right stuff', () => {
      let _gen = {
        name: 'a',
        appName: 'a',
        config: {
          get(){
            return 'ng1'
          }
        },
        options: {feature: 'c'},
        template: sinon.spy()
      };

      let _rsg = new ResourceSubGenerator(_gen);

      _rsg.writing();

      let _firstCall = ['ng1/resource.js', knownPaths.PATH_CLIENT_FEATURES + _gen.options.feature + '/resources/' + _gen.name + '.js', {name: _gen.name, appName: _gen.appName}];

      expect(_rsg.generator.writing).to.have.been.called;
      expect(_rsg.generator.template.calledWith(_firstCall[0], _firstCall[1], _firstCall[2])).to.be.true;
    });
  });
});
