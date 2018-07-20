import { Questions, Answers, Instances } from '/lib/common.js';

Template.answers.onCreated(function () {
  this.replyCount = new ReactiveVar(0);
});

Template.answers.onRendered(() => {
  // When the template is rendered, sets the document title
  $('.formcontainer').hide().fadeIn(400);
  $('#darker').hide().fadeIn(400);
  $('#replyadvancedcheck')[0].style.display = 'none';
});

Template.answers.helpers({
  returnID() {
    return Template.currentData();
  },
  replyCount() {
    return Template.instance().replyCount.get();
  },
  responseLength() {
    // to return the maximum response length
    const id = Template.currentData();
    const instanceId = Questions.findOne({ _id: id }).instanceid;
    const toReturn = Instances.findOne({_id: instanceId}).max_response;
    return toReturn;
  },
  question() {
    const id = Template.currentData();
    return Questions.findOne({ _id: id });
  },
  date_format(timeorder) {
    return moment(timeorder).format('LLL');
  },
  time_format(timeorder) {
    return moment(timeorder).fromNow();
  },
  answers() {
    const id = Template.currentData();

    const answers = Answers.find({
      qid: id,
    }).fetch();

    answers.reverse();
    for (let a = 0; a < answers.length; a++) {
      answers[a].text = answers[a].text.replace(/\B(@\S+)/g, '<strong>$1</strong>');
      const urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
      answers[a].text = answers[a].text.replace(urlRegex, (url) => {
        let hasPeren = false;
        let fullURL = url;
        console.log("url: ", url);
        console.log("fullURL: ", fullURL);
        if (url.charAt(url.length - 1) === ')') {
          url = url.substring(0, url.length - 1);
          hasPeren = true;
        }
        if (url.indexOf('http://') === -1 || url.indexOf('https://') === -1) {
          fullURL = 'http://' + url;
        }
        if (!hasPeren) {
          return '<a target="_blank" class="questionLink" rel="nofollow" href="' + fullURL + '">' + url + '</a>';
        }
        return '<a target="_blank" class="questionLink" rel="nofollow" href="' + fullURL + '">' + url + '</a>)';
      });
    }

    // answers.reverse();
    // for (let a = 0; a < answers.length; a++) {
    //   answers[a].text = answers[a].text.replace(/\B(@\S+)/g, '<strong>$1</strong>');
    //   const urlRegex = new RegExp(SimpleSchema.RegEx.Url.source.slice(1, -1), 'ig');
    //   answers[a].text = answers[a].text.replace(urlRegex, url =>
    //     '<a target="_blank" class="questionLink" rel="nofollow" href="' + url + '">' + url + '</a>');
    // }
    console.log("returning: ", answers);
    return answers;
  },
  allowAnonym() {
    const id = Template.currentData();
    const instanceId = Questions.findOne({ _id: id }).instanceid;
    const toReturn = Instances.findOne({_id: instanceId}).anonymous;
    return toReturn;
  },
});

/* eslint-disable func-names, no-unused-vars */
Template.answers.events({
  'click #darker': function (event, template) {
    $('.formcontainer').fadeOut(400);
    $('#darker').fadeOut(400, () => {
      Blaze.remove(popoverTemplate);
    });
  },
  'keyup .replyBoxArea': function (event, template) {
    // check if URL is present in the text
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
    const found = event.target.value.match(urlRegex);
    let total = 0;
    if (found) {
      let totalURL = 0;
      const sumOfLengths = (a, b) => a + b.length;
      totalURL = found.reduce(sumOfLengths, 0);
      total = (event.target.value.length - totalURL) + found.length;
      const questionId = template.data;
      const instanceId = Questions.findOne({ _id: questionId }).instanceid;
      $(event.target).attr('maxlength', Number(Instances.findOne({ _id: instanceId }).max_response + totalURL - found.length));
    } else {
      total = event.target.value.length;
    }
    template.replyCount.set(total);
  },
});
/* eslint-enable func-names, no-unused-vars */
