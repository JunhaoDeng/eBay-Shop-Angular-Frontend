import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})
export class SellerComponent implements OnInit {
  @Input() sellerDetails: any;

  // Define the properties
  feedbackScore: string = '';
  feedbackScoreNum: number = 0;
  positiveFeedbackPercent: string = '';
  positiveFeedbackPercentNum: number = 0;
  feedbackRatingStar: string = '';
  topRatedSeller: boolean = false;
  storeName: string = '';
  storeURL: string = '';
  starOrStarBorder: any;
  starColor: string = '';

  ngOnInit(): void {
    // Extract the information from the input data
    if (this.sellerDetails) {
      this.feedbackScore = this.sellerDetails.sellerInfo.feedbackScore[0];
      //change the feedback score to a number
      this.feedbackScoreNum = Number(this.feedbackScore);
      if (this.feedbackScoreNum >= 10000) {
        this.starOrStarBorder = 'star';
      } else {
        this.starOrStarBorder = 'star_border';
      }
      console.log('starOrStarBorder: ' + this.starOrStarBorder);
      this.positiveFeedbackPercent =
        this.sellerDetails.sellerInfo.positiveFeedbackPercent[0];
      //change the positiveFeedbackPercent score to a number
      this.positiveFeedbackPercentNum = Number(this.positiveFeedbackPercent);
      this.feedbackRatingStar =
        this.sellerDetails.sellerInfo.feedbackRatingStar[0];
      this.starColor = this.getColorFromRatingStar(this.feedbackRatingStar);
      console.log('starColor: ' + this.starColor);
      this.topRatedSeller =
        this.sellerDetails.sellerInfo.topRatedSeller[0] === 'true';
      this.storeName = this.sellerDetails.storeInfo.storeName[0];
      this.storeURL = this.sellerDetails.storeInfo.storeURL[0];
    }
  }
  getColorFromRatingStar(ratingStar: string): string {
    // Remove the "Shooting" part of the string, if it exists.
    let cleanRatingStar = ratingStar.replace('Shooting', '');

    // Convert the remaining string to lowercase to get the color.
    let color = cleanRatingStar.toLowerCase();
    return color;
  }

  capitalLetterWithoutSpace(str: string): string {
    // Convert the string to lowercase
    let lowerCaseStr = str.toLowerCase();

    // Split the string into an array of words
    let words = lowerCaseStr.split(' ');

    // Capitalize the first letter of each word
    let capitalizedWords = words.map((word) => {
      return word.toUpperCase();
    });

    // Join the words back together
    let capitalizedStr = capitalizedWords.join('');

    return capitalizedStr;
  }
}
