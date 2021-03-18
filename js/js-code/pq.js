Survey.defaultBootstrapMaterialCss.navigationButton = "btn btn-green";
Survey.defaultBootstrapMaterialCss.rating.item = "btn btn-default my-rating";
Survey
    .StylesManager
    .applyTheme("bootstrapmaterial");

var json = {
    // questionTitlePattern: "requireNumTitle",
    
    pages: [
        //page1: strategies
        {
          questions: [
          {
              type: "text",
              name: "q1",
              title: "Could you explain your strategies for selecting top3 hotels?",
              isRequired: true
          },
          {
              type: "text",
              name: "q2",
              title: "Could you explain your strategies for eliminating candidate hotels?",
              isRequired: true
          },
          {
            type: "text",
            name: "q3",
            title: "Could you explain your strategies for ranking the top3 hotels?",
            isRequired: true
          },
          {
            "type": "radiogroup",
            "hasOther": true,
            "isRequired": true,
            "name": "favoritePet",
            "title": "What is your favorite pet ![A parrot](https://surveyjs.io/Content/Images/examples/markdown/image_16x16.svg =16x16) ?",
            "choices": [
                {
                    "value": "dog",
                    "text": "Dog: ![A dog](https://surveyjs.io/Content/Images/examples/markdown/dog.svg =14x14)"
                }, {
                    "value": "cat",
                    "text": "Cat: ![A cat](https://surveyjs.io/Content/Images/examples/markdown/cat.svg =14x14)"
                }, {
                    "value": "parrot",
                    "text": "Parrot ![A parrot](https://surveyjs.io/Content/Images/examples/markdown/parrot.svg =14x14)"
                }
            ]
          }
          ]
        },
        {
            questions: [
              {
                  type: "rating",
                  name: "Q4",
                  title: "To what extent does the user rating bar (on a scale of 1-5) contribute to your decision?",
                  mininumRateDescription: " ",
                  maximumRateDescription: " ",
                  rateValues: [
                    "7 (Greatly)",
                    "6",
                    "5",
                    "4",
                    "3",
                    "2",
                    "1 (Minimal)"
                  ],
                  isRequired: true
              },
              {
                type: "rating",
                name: "Q5",
                title: "To what extent does the reviewers' emotion distribution in pie charts contribute to your decision?",
                mininumRateDescription: " ",
                maximumRateDescription: " ",
                rateValues: [
                  "7 (Greatly)",
                  "6",
                  "5",
                  "4",
                  "3",
                  "2",
                  "1 (Minimal)"
                ],
                isRequired: true
              },
              {
                type: "rating",
                name: "Q6",
                title: "To what extent does the reviewers' contribution distribution in pie charts contribute to your decision?",
                mininumRateDescription: " ",
                maximumRateDescription: " ",
                rateValues: [
                  "7 (Greatly)",
                  "6",
                  "5",
                  "4",
                  "3",
                  "2",
                  "1 (Minimal)"
                ],
                isRequired: true
              },
              {
                type: "rating",
                name: "Q7",
                title: "To what extent does the reviewers' helpful votes distribution in pie charts contribute to your decision?",
                mininumRateDescription: " ",
                maximumRateDescription: " ",
                rateValues: [
                  "7 (Greatly)",
                  "6",
                  "5",
                  "4",
                  "3",
                  "2",
                  "1 (Minimal)"
                ],
                isRequired: true
              },
              {
                type: "rating",
                name: "Q8",
                title: "To what extent does the reviewers' {aspect} distribution in pie charts contribute to your decision?",
                mininumRateDescription: " ",
                maximumRateDescription: " ",
                rateValues: [
                  "7 (Greatly)",
                  "6",
                  "5",
                  "4",
                  "3",
                  "2",
                  "1 (Minimal)"
                ],
                isRequired: true
              }
                // {
                //     type: "rating",
                //     name: "recommend friends",
                //     visibleIf: "{satisfaction} > 3",
                //     title: "How likely are you to recommend the Product to a friend or co-worker?",
                //     mininumRateDescription: "Will not recommend",
                //     maximumRateDescription: "I will recommend"
                // }, 
                // {
                //     type: "comment",
                //     name: "suggestions",
                //     title: "What would make you more satisfied with the Product?"
                // }
            ]
        }, 
        {
            questions: [
                {
                    type: "radiogroup",
                    name: "price to competitors",
                    title: "Compared to our competitors, do you feel the Product is",
                    choices: ["Less expensive", "Priced about the same", "More expensive", "Not sure"]
                }, {
                    type: "radiogroup",
                    name: "price",
                    title: "Do you feel our current price is merited by our product?",
                    choices: ["correct|Yes, the price is about right", "low|No, the price is too low for your product", "high|No, the price is too high for your product"]
                }, {
                    type: "multipletext",
                    name: "pricelimit",
                    title: "What is the... ",
                    items: [
                        {
                            name: "mostamount",
                            title: "Most amount you would every pay for a product like ours"
                        }, {
                            name: "leastamount",
                            title: "The least amount you would feel comfortable paying"
                        }
                    ]
                }
            ]
        }
    ]
};

window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    });

$("#surveyElement").Survey({model: survey});