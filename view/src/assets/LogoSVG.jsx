import React from "react";
import Icon from '@ant-design/icons';

const LogoSvg = () => (
    <svg width="300" height="60" viewBox="0 0 1000 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="50" fill="white"/>
    <path d="M467.518 94.6904C465.271 95.0322 463.196 95.7891 461.292 96.9609C459.388 98.084 457.776 100.208 456.458 103.333C453.04 111.683 450.306 118.421 448.255 123.548C446.204 128.675 443.323 136.072 439.612 145.74C438.831 147.742 437.879 150.501 436.756 154.017C435.682 157.532 434.827 160.413 434.192 162.659H419.91L401.453 112.854L384.168 162.659H370.032C365.101 149.329 361.219 139.002 358.387 131.678C355.555 124.305 351.771 114.588 347.034 102.527C346.155 100.232 344.642 98.4258 342.493 97.1074C340.394 95.7891 338.221 94.9834 335.975 94.6904V89.3438H380.945V94.6904C379.285 94.8369 377.308 95.2275 375.013 95.8623C372.718 96.4971 371.57 97.3516 371.57 98.4258C371.57 98.9141 371.619 99.3535 371.717 99.7441C371.863 100.086 372.083 100.745 372.376 101.722C373.694 105.53 375.501 110.462 377.796 116.517C380.091 122.522 382.776 129.529 385.853 137.537L402.112 89.3438H416.614L435.145 139.148C437.977 131.629 440.149 125.721 441.663 121.424C443.226 117.078 445.179 111.487 447.522 104.651C447.864 103.626 448.06 102.723 448.108 101.941C448.206 101.111 448.23 100.574 448.182 100.33C448.182 99.4512 447.742 98.6699 446.863 97.9863C445.984 97.2539 444.935 96.668 443.714 96.2285C442.493 95.7891 441.297 95.4473 440.125 95.2031C439.002 94.959 438.05 94.7881 437.269 94.6904V89.3438H467.518V94.6904ZM549.476 144.495C547.767 147.278 545.691 149.915 543.25 152.405C540.857 154.847 538.123 156.946 535.047 158.704C531.775 160.56 528.455 161.951 525.086 162.879C521.766 163.855 517.933 164.344 513.587 164.344C506.36 164.344 500.11 163.318 494.837 161.268C489.612 159.217 485.291 156.458 481.873 152.991C478.455 149.524 475.892 145.447 474.183 140.76C472.522 136.023 471.692 130.896 471.692 125.379C471.692 120.398 472.596 115.638 474.402 111.097C476.258 106.507 478.87 102.43 482.239 98.8652C485.56 95.3984 489.734 92.5908 494.764 90.4424C499.842 88.2939 505.506 87.2197 511.756 87.2197C518.592 87.2197 524.207 88.0498 528.602 89.71C532.996 91.3701 536.634 93.665 539.515 96.5947C542.298 99.3779 544.324 102.674 545.594 106.482C546.863 110.242 547.498 114.197 547.498 118.348V123.108H497.986C497.986 133.118 499.915 140.735 503.772 145.96C507.63 151.185 513.758 153.797 522.156 153.797C526.746 153.797 530.872 152.552 534.534 150.062C538.196 147.522 541.321 144.324 543.909 140.467L549.476 144.495ZM521.497 116.663C521.497 113.733 521.351 110.73 521.058 107.654C520.765 104.578 520.252 102.063 519.52 100.11C518.689 97.8154 517.542 96.082 516.077 94.9102C514.661 93.7383 512.854 93.1523 510.657 93.1523C506.897 93.1523 503.895 95.0566 501.648 98.8652C499.402 102.674 498.182 108.704 497.986 116.956L521.497 116.663ZM601.185 162H555.262V156.653C556.531 156.556 557.752 156.434 558.924 156.287C560.145 156.141 561.219 155.896 562.146 155.555C563.709 154.969 564.759 154.139 565.296 153.064C565.882 151.941 566.175 150.477 566.175 148.67V67.5176C566.175 65.6621 565.784 63.9531 565.003 62.3906C564.271 60.7793 563.27 59.5586 562 58.7285C561.023 58.0937 559.534 57.4834 557.532 56.8975C555.579 56.3115 553.846 55.9697 552.332 55.8721V50.5254L589.173 48.6211L590.271 49.793V147.718C590.271 149.524 590.589 150.989 591.224 152.112C591.858 153.235 592.884 154.114 594.3 154.749C595.276 155.188 596.302 155.579 597.376 155.921C598.45 156.263 599.72 156.507 601.185 156.653V162ZM652.894 162H606.971V156.653C608.24 156.556 609.461 156.434 610.633 156.287C611.854 156.141 612.928 155.896 613.855 155.555C615.418 154.969 616.468 154.139 617.005 153.064C617.591 151.941 617.884 150.477 617.884 148.67V67.5176C617.884 65.6621 617.493 63.9531 616.712 62.3906C615.979 60.7793 614.979 59.5586 613.709 58.7285C612.732 58.0937 611.243 57.4834 609.241 56.8975C607.288 56.3115 605.555 55.9697 604.041 55.8721V50.5254L640.882 48.6211L641.98 49.793V147.718C641.98 149.524 642.298 150.989 642.933 152.112C643.567 153.235 644.593 154.114 646.009 154.749C646.985 155.188 648.011 155.579 649.085 155.921C650.159 156.263 651.429 156.507 652.894 156.653V162ZM706.287 162H659.998V156.653C661.268 156.556 662.513 156.434 663.733 156.287C664.954 156.141 666.004 155.896 666.883 155.555C668.445 154.969 669.544 154.139 670.179 153.064C670.813 151.941 671.131 150.477 671.131 148.67V106.043C671.131 104.334 670.74 102.845 669.959 101.575C669.178 100.257 668.201 99.207 667.029 98.4258C666.15 97.8398 664.808 97.2783 663.001 96.7412C661.243 96.2041 659.632 95.8623 658.167 95.7158V90.3691L694.056 88.4648L695.154 89.5635V147.718C695.154 149.427 695.521 150.892 696.253 152.112C696.985 153.284 698.035 154.163 699.402 154.749C700.379 155.188 701.453 155.579 702.625 155.921C703.797 156.263 705.018 156.507 706.287 156.653V162ZM695.594 62.0977C695.594 65.8086 694.153 68.9824 691.272 71.6191C688.44 74.207 685.071 75.501 681.165 75.501C677.21 75.501 673.792 74.207 670.911 71.6191C668.079 68.9824 666.663 65.8086 666.663 62.0977C666.663 58.3867 668.079 55.2129 670.911 52.5762C673.792 49.9395 677.21 48.6211 681.165 48.6211C685.12 48.6211 688.514 49.9395 691.346 52.5762C694.178 55.2129 695.594 58.3867 695.594 62.0977ZM782.312 60.999C782.312 62.2197 782.117 63.5625 781.727 65.0273C781.336 66.4922 780.701 67.7373 779.822 68.7627C778.797 69.9834 777.649 70.9111 776.38 71.5459C775.11 72.1807 773.206 72.498 770.667 72.498C766.81 72.498 763.782 71.1553 761.585 68.4697C759.388 65.7842 757.044 61.3164 754.554 55.0664C752.601 55.8965 751.014 58.0449 749.793 61.5117C748.572 64.9785 747.962 72.4248 747.962 83.8506V89.6367H768.177V97.5469H748.108V148.011C748.108 149.915 748.548 151.404 749.427 152.479C750.306 153.504 751.453 154.261 752.869 154.749C754.041 155.14 755.579 155.53 757.483 155.921C759.388 156.263 761.097 156.507 762.61 156.653V162H713.172V156.653C714.441 156.556 715.662 156.434 716.834 156.287C718.055 156.141 719.129 155.896 720.057 155.555C721.619 154.969 722.669 154.139 723.206 153.064C723.792 151.941 724.085 150.477 724.085 148.67V97.5469H709.217V89.6367H724.085C724.085 84.4121 724.842 79.3584 726.355 74.4756C727.869 69.5439 730.213 65.1494 733.387 61.292C736.463 57.4834 740.516 54.4072 745.545 52.0635C750.574 49.7197 756.482 48.5479 763.27 48.5479C769.324 48.5479 774.012 49.6953 777.332 51.9902C780.652 54.2852 782.312 57.2881 782.312 60.999ZM854.822 94.6904C852.625 95.0322 850.477 95.8623 848.377 97.1807C846.326 98.499 844.617 100.55 843.25 103.333C839.051 112.22 834.729 121.692 830.286 131.751C825.843 141.761 820.911 152.601 815.491 164.271C812.464 170.813 809.534 176.038 806.702 179.944C803.87 183.851 801.209 186.854 798.719 188.953C796.375 190.906 794.056 192.322 791.761 193.201C789.466 194.08 787.146 194.52 784.803 194.52C780.164 194.52 776.404 193.226 773.523 190.638C770.691 188.05 769.275 185.145 769.275 181.922C769.275 180.555 769.422 179.285 769.715 178.113C770.057 176.941 770.74 175.721 771.766 174.451C772.547 173.377 773.743 172.449 775.354 171.668C777.015 170.936 778.87 170.569 780.921 170.569C783.655 170.569 786.268 171.521 788.758 173.426C791.248 175.33 793.836 177.967 796.521 181.336C798.133 179.725 800.11 177.308 802.454 174.085C804.847 170.911 806.604 167.64 807.728 164.271C801.917 152.063 796.766 141.492 792.273 132.557C787.781 123.572 782.752 113.562 777.186 102.527C775.965 100.184 774.329 98.377 772.278 97.1074C770.228 95.7891 768.055 94.9834 765.76 94.6904V89.3438H810.584V94.6904C808.924 94.7393 806.995 95.1055 804.798 95.7891C802.649 96.4727 801.575 97.3516 801.575 98.4258C801.575 98.8164 801.648 99.2559 801.795 99.7441C801.941 100.184 802.21 100.843 802.601 101.722C804.261 105.14 806.604 109.9 809.632 116.004C812.708 122.059 816.272 129.163 820.325 137.317C823.353 130.384 825.916 124.427 828.016 119.446C830.164 114.417 832.239 109.485 834.241 104.651C834.729 103.431 834.998 102.479 835.047 101.795C835.145 101.062 835.193 100.574 835.193 100.33C835.193 99.4512 834.754 98.6943 833.875 98.0596C833.045 97.376 832.044 96.79 830.872 96.3018C829.651 95.8135 828.479 95.4473 827.356 95.2031C826.233 94.959 825.306 94.7881 824.573 94.6904V89.3438H854.822V94.6904Z" fill="black"/>
    <path d="M162.468 43.3139C167.594 43.3139 179.568 41.2713 201.778 49.4401C223.443 57.4038 235.523 96.1289 230.792 103.865C226.062 111.601 200.07 102.529 188.105 94.3623C174.118 84.8149 155.632 43.3121 162.468 43.3139Z" fill="url(#paint0_linear)"/>
    <path d="M226.781 92.7837H236.154C238.742 92.7837 240.84 94.1324 240.84 95.7964C238.335 105.471 236.766 115.365 236.154 125.342C234.983 142.668 238.742 165.1 236.154 165.1H226.781C224.193 165.1 223.63 126.672 220.989 109.079C218.348 91.4853 216.218 94.7462 216.218 94.7462C216.218 93.0822 224.193 92.7837 226.781 92.7837Z" fill="#17A398"/>
    <path d="M307.637 48.4124C310.974 42.294 313.91 35.9642 316.427 29.463C310.403 18.7981 269.091 17.2983 249.87 30.2633C228.714 44.5322 212.424 99.4925 216.989 104.736C221.555 109.98 239.733 111.079 268.028 94.7486C281.368 87.0461 300.301 61.7318 307.637 48.4124Z" fill="url(#paint1_linear)"/>
    <defs>
    <linearGradient id="paint0_linear" x1="207.028" y1="95.7811" x2="113.857" y2="-20.29" gradientUnits="userSpaceOnUse">
    <stop stop-color="#56D1B4"/>
    <stop offset="0.679" stop-color="#518659"/>
    <stop offset="1" stop-color="#395E3F"/>
    </linearGradient>
    <linearGradient id="paint1_linear" x1="265.914" y1="114.87" x2="329.847" y2="28.6719" gradientUnits="userSpaceOnUse">
    <stop stop-color="#56D1B4"/>
    <stop offset="0.847" stop-color="#539E77"/>
    <stop offset="1" stop-color="#2C5C44"/>
    </linearGradient>
    </defs>
    </svg>
    

  );

  export const Logo = props => <Icon component={LogoSvg} {...props} />;