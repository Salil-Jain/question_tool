import { Votes, Answers, Instances, Questions } from '/lib/common.js';

Template.question_div.helpers({
  isPoster() {
    return Meteor.user() && Meteor.user().emails[0].address === this.email && this.posterLoggedIn;
  },

  isDisabled() {
    if (Questions.findOne({ _id: this._id }).state == 'disabled') {
      return true;
    }
    return false;
  },

  hasAnswers() {
    const answers = Answers.find({
      qid: this._id,
    });
    return answers.fetch().length > 0;
  },

  answersCount() {
    const count = Answers.find({ qid: this._id }).fetch().length;
    const base = 'repl';
    const add = count > 1 ? 'ies' : 'y';
    return count + ' ' + base + add;
  },

  voteCount() {
    return Votes.find({ qid: this._id }).fetch().length;
  },

  date_format(timeorder) {
    return moment(timeorder).format('LLL');
  },

  time_format(timeorder) {
    return moment(timeorder).fromNow();
  },
});

Template.question_div.events({
  'click .sharing': function (event, template) {
    $(event.target.children).toggle();
  },
  'click .showreplies': function (event, template) {
    const parentNode = document.getElementById('main-wrapper');
    popoverTemplate = Blaze.renderWithData(Template.answers, template.data._id, parentNode);
  },
  'click .adminquestionmodify': function (event, template) {
    const parentNode = document.getElementById('nav');
    popoverTemplate = Blaze.renderWithData(Template.modify, template.data._id, parentNode);
  },
});
